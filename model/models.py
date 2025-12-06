from sqlalchemy import (
    String, 
    Integer, 
    Text, 
    Column, 
    Float,
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


class Region(Base):
    __tablename__ = "regions"

    id = Column(Integer, primary_key=True, index=True)
    region = Column(String, nullable=False)

    objects = relationship("Object", back_populates="region")


class Object(Base):
    __tablename__ = "objects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    region_id = Column(Integer, ForeignKey("regions.id"), default=1)
    resource_type_id = Column(Integer, ForeignKey("resource_types.id"), nullable=True)
    water_type_id = Column(Integer, ForeignKey("water_types.id"), nullable=True)
    fauna = Column(Boolean, default=False)
    passport_date = Column(Date, nullable=True)
    technical_condition = Column(Integer, default=5)
    latitude = Column(DECIMAL(10, 6), nullable=True)
    longitude = Column(DECIMAL(10, 6), nullable=True)
    danger_level_cm = Column(Integer, nullable=True)
    actual_level_cm = Column(Integer, nullable=True)
    actual_discharge_m3s = Column(Integer, nullable=True)
    water_temperature_C = Column(Integer, nullable=True)
    water_object_code = Column(String, nullable=True)
    pdf_url = Column(Text, default="")

    region = relationship("Region", back_populates="objects")
    resource_type = relationship("ResourceType", back_populates="objects")
    water_type = relationship("WaterType", back_populates="objects")


class WaterClass(Base):
    __tablename__ = "water_classes"

    id = Column(Integer, primary_key=True, index=True)
    latitude = Column(DECIMAL(10, 6), nullable=True)
    longitude = Column(DECIMAL(10, 6), nullable=True)
    description = Column(Text, nullable=True)
    water_class = Column(Integer, nullable=True)
    location_info = Column(Text, nullable=True)
    purpose = Column(Text, nullable=True)
    fauna = Column(Text, nullable=True)
    index = Column(String, nullable=True)
    parameter = Column(String, nullable=True)
    unit = Column(String, nullable=True)
    concentration = Column(Float, nullable=True)
    background = Column(Float, nullable=True)


class Features(Base):
    __tablename__ = "features"

    id = Column(Integer, primary_key=True, index=True)
    CAP_MCM = Column(Float, nullable=True)
    CAP_MAX = Column(Float, nullable=True)
    CAP_MIN = Column(Float, nullable=True)
    AREA_SKM = Column(Float, nullable=True)
    AREA_MAX = Column(Float, nullable=True)
    DEPTH_M = Column(Float, nullable=True)
    CATCH_SKM = Column(Float, nullable=True)
    DIS_AVG_LS = Column(Float, nullable=True)
    ELEV_MASL = Column(Float, nullable=True)
    DAM_HGT_M = Column(Float, nullable=True)
    DAM_LEN_M = Column(Float, nullable=True)
    DAM_TYPE = Column(String, nullable=True)
    INSTREAM = Column(String, nullable=True)
    date = Column(Date, nullable=True)