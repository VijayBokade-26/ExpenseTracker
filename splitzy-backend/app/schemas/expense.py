from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, constr

from app.models.enums import CategoryEnum


class ExpenseCreate(BaseModel):
    title: constr(strip_whitespace=True, min_length=1, max_length=255)
    amount: Decimal
    category: CategoryEnum
    date: date

class ExpenseUpdate(BaseModel):
    title: Optional[constr(strip_whitespace=True, min_length=1, max_length=255)] = None
    amount: Optional[Decimal] = None
    category: Optional[CategoryEnum] = None
    date: Optional[date] = None

class ExpenseResponse(BaseModel):
    id: int
    title: str
    amount: Decimal
    category: CategoryEnum
    date: date
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ExpenseActionResponse(BaseModel):
    message: str
    data: ExpenseResponse

class ExpenseListResponse(BaseModel):
    message: str
    data: list[ExpenseResponse]

class ExpenseDeleteMultiple(BaseModel):
    ids: list[int]

class BulkDeleteResponse(BaseModel):
    message: str
    data: list[int]

class DashboardTotalSpent(BaseModel):
    totalSpent: Decimal

class DashboardCategorySpent(BaseModel):
    category: CategoryEnum
    totalSpent: Decimal

class DashboardRecentSpent(BaseModel):
    category: CategoryEnum
    totalSpent: Decimal
    title: str
    date: date

class DashboardData(BaseModel):
    totalSpentData: DashboardTotalSpent
    categoryWiseSpent: list[DashboardCategorySpent]
    recentSpent: list[DashboardRecentSpent]

class DashboardResponse(BaseModel):
    statusCode: int
    message: str
    data: DashboardData
