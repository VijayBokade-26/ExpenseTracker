from sqlalchemy import (
    Column,
    Date,
    DateTime,
    Enum as SQLEnum,
    ForeignKey,
    Integer,
    Numeric,
    String,
    func,
)
from sqlalchemy.orm import relationship

from app.config.db import Base
from app.models.enums import CategoryEnum


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
    expenses = relationship(
        'Expense',
        back_populates='user',
        cascade='all, delete-orphan',
        passive_deletes=True,
    )


class Expense(Base):
    __tablename__ = 'expenses'

    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    category = Column(SQLEnum(CategoryEnum, name='category_enum'), nullable=False)
    date = Column(Date, nullable=False)
    user_id = Column(
        Integer,
        ForeignKey('users.id', ondelete='CASCADE'),
        nullable=False,
        index=True,
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),  
        onupdate=func.now(),
        nullable=False,
    )

    user = relationship('User', back_populates='expenses')
