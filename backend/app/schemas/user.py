from datetime import date
from pydantic import BaseModel, Field, computed_field, ConfigDict


class UserBase(BaseModel):
    firstname: str = Field(min_length=1, max_length=100)
    lastname: str = Field(min_length=1, max_length=100)
    date_of_birth: date


class UserCreate(UserBase):
    pass


class UserRead(UserBase):
    id: int

    @computed_field
    @property
    def age(self) -> int:
        today = date.today()
        dob = self.date_of_birth
        years = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
        return max(0, years)

    model_config = ConfigDict(from_attributes=True)
