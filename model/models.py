from sqlalchemy import (
    String, 
    Integer, 
    Text, 
    Column, 
    Date, 
    ForeignKey, 
    Boolean, 
    DECIMAL, 
    Enum as SAEnum,
)
from sqlalchemy.orm import relationship
from database.db import Base
from enum import Enum


class UserRole(str, Enum):
    guest = "guest"
    expert = "expert"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False, index=True)
    password = Column(Text, nullable=False)
    role = Column(
        SAEnum(UserRole, name="user_role_enum"),
        nullable=False,
        default=UserRole.guest,
        server_default="guest"
    )


class ResourceType(Base):
    __tablename__ = "resource_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    objects = relationship("Object", back_populates="resource_type")


class WaterType(Base):
    __tablename__ = "water_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    objects = relationship("Object", back_populates="water_type")


class Object(Base):
    __tablename__ = "objects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    region = Column(String, nullable=True)
    resource_type_id = Column(Integer, ForeignKey("resource_types.id"), nullable=True)
    water_type_id = Column(Integer, ForeignKey("water_types.id"), nullable=True)
    fauna = Column(Boolean, default=False)
    passport_date = Column(Date, nullable=True)
    technical_condition = Column(Integer, default=5)
    latitude = Column(DECIMAL(10, 6), nullable=True)
    longitude = Column(DECIMAL(10, 6), nullable=True)
    pdf_url = Column(Text, default="")

    resource_type = relationship("ResourceType", back_populates="objects")
    water_type = relationship("WaterType", back_populates="objects")