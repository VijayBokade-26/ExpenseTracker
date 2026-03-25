from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.models.enums import CategoryEnum
from app.models.models import Expense
from app.schemas.expense import (
    BulkDeleteResponse,
    DashboardResponse,
    ExpenseActionResponse,
    ExpenseCreate,
    ExpenseDeleteMultiple,
    ExpenseListResponse,
    ExpenseUpdate,
)
from sqlalchemy.exc import SQLAlchemyError

router = APIRouter(prefix='/expenses', tags=['expenses'])


@router.get('/protected')
def protected_route(current_user=Depends(get_current_user)):
    return {
        'message': 'You are authorized',
        'user_id': current_user.id,
        'email': current_user.email,
    }


@router.post('', response_model=ExpenseActionResponse, status_code=status.HTTP_201_CREATED)
def add_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    new_expense = Expense(
        title=expense.title.strip(),
        amount=Decimal(expense.amount),
        category=expense.category,
        date=expense.date,
        user_id=current_user.id,
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return {
        'message': 'Expense added successfully.',
        'data': new_expense,
    }


@router.get('', response_model=ExpenseListResponse)
def get_expenses(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    expenses = (
        db.query(Expense)
        .filter(Expense.user_id == current_user.id)
        .order_by(Expense.date.desc(), Expense.id.desc())
        .all()
    )

    return {
        'message': 'Expenses fetched successfully.',
        'data': expenses,
    }


# @router.get('/dashboard', response_model=DashboardResponse)
# def get_dashboard(
#     db: Session = Depends(get_db),
#     current_user=Depends(get_current_user),
# ):
#     def as_decimal(value):
#         if value is None:
#             return Decimal('0')
#         if isinstance(value, Decimal):
#             return value
#         return Decimal(str(value))

#     total_spent = (
#         db.query(func.coalesce(func.sum(Expense.amount), 0))
#         .filter(Expense.user_id == current_user.id)
#         .scalar()
#     )

#     total_spent_expr = func.coalesce(func.sum(Expense.amount), 0)
#     category_rows = (
#         db.query(Expense.category, total_spent_expr.label('total_spent'))
#         .filter(Expense.user_id == current_user.id)
#         .group_by(Expense.category)
#         .order_by(total_spent_expr.desc())
#         .all()
#     )

#     recent_expenses = (
#         db.query(Expense)
#         .filter(Expense.user_id == current_user.id)
#         .order_by(Expense.created_at.desc(), Expense.id.desc())
#         .limit(5)
#         .all()
#     )

#     return {
#         'statusCode': 200,
#         'message': 'fetched successfully',
#         'data': {
#             'totalSpentData': {
#                 'totalSpent': as_decimal(total_spent),
#             },
#             'categoryWiseSpent': [
#                 {
#                     'category': category,
#                     'totalSpent': as_decimal(spent_total),
#                 }
#                 for category, spent_total in category_rows
#             ],
#             'recentSpent': [
#                 {
#                     'category': expense.category,
#                     'totalSpent': as_decimal(expense.amount),
#                     'desc': expense.title,
#                     'date': expense.date,
#                 }
#                 for expense in recent_expenses
#             ],
#         },
#     }


@router.put('/{expense_id}', response_model=ExpenseActionResponse)
def update_expense(
    expense_id: int,
    expense: ExpenseUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    db_expense = (
        db.query(Expense)
        .filter(Expense.id == expense_id, Expense.user_id == current_user.id)
        .first()
    )
    if not db_expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Expense not found.',
        )

    update_data = expense.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='At least one field must be provided to update the expense.',
        )

    if 'title' in update_data and update_data['title'] is not None:
        update_data['title'] = update_data['title'].strip()
    if 'amount' in update_data and update_data['amount'] is not None:
        update_data['amount'] = Decimal(update_data['amount'])

    for field, value in update_data.items():
        setattr(db_expense, field, value)

    db.commit()
    db.refresh(db_expense)
    return {
        'message': 'Expense updated successfully.',
        'data': db_expense,
    }


@router.delete('/bulk-delete', response_model=BulkDeleteResponse)
def bulk_delete(
    payload: ExpenseDeleteMultiple,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    expenses = (
        db.query(Expense)
        .filter(Expense.id.in_(payload.ids), Expense.user_id == current_user.id)
        .all()
    )
    if not expenses:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='No expenses found.',
        )

    deleted_ids = [exp.id for exp in expenses]

    for exp in expenses:
        db.delete(exp)
    db.commit()

    return {
        'message': f'Expense Ids: {deleted_ids} deleted successfully.',
        'data': deleted_ids,
    }


@router.get('/categories')
def get_categories():
    return {'data': [cat.value for cat in CategoryEnum]}


@router.get("/dashboard", response_model = DashboardResponse)
def get_dashboard_details(
    db:Session = Depends(get_db),
    current_user = Depends(get_current_user) 
):
    try:
        total_spent = db.query(func.coalesce(func.sum(Expense.amount),0)
                            ).filter(
                                Expense.user_id == current_user.id
                            ).scalar()
        
        category_data = db.query(Expense.category, func.sum(Expense.amount).lable("total")
                                    ).filter(
                                        Expense.user_id == current_user.id
                                    ).group_by(
                                        Expense.category
                                    ).all()
        category_wise_spent = [
            {
                "category":cat,
                "totalspent":float(total)
            }
            for cat , total in category_data
        ]

        recent_expenses = db.query(Expense).filter(
            Expense.user_id == current_user.id
        ).order_by(
            Expense.date.desc()
        ).limit(5).all()

        recent_spent = [
            {
                "category":exp.category,
                "totalSpent":float(exp.amount),
                "desc":exp.title,
                "date":exp.date.isoformat()
            }
            for exp in recent_expenses
        ]

        return {
                "statusCode":200,
                "message":"Fetched successfully",
                "data":{
                    "totalSpentData":{
                        "totalSpent":float(total_spent)
                    },
                    "categoryWiseSpent":category_wise_spent,
                    "recentspent":recent_spent
                }


        }
    
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='Failed to fetch dashboard data.',
        )
    
