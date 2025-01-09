from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length, Email, Optional, EqualTo, ValidationError
from flask_wtf import FlaskForm
import re

# Custom password strength validator
def password_strength(form, field):
    password = field.data
    if not re.search(r'\d', password):  # at least one digit
        raise ValidationError('Password must contain at least one number.')
    if not re.search(r'[A-Z]', password):  # at least one uppercase letter
        raise ValidationError('Password must contain at least one uppercase letter.')
    if not re.search(r'[!@#$%^&*()]', password):  # at least one special character
        raise ValidationError('Password must contain at least one special character: !@#$%^&*()')

# Phone number validation regex
def phone_number(form, field):
    if field.data and not re.match(r'^\+?[1-9]\d{1,14}$', field.data):
        raise ValidationError('Invalid phone number format.')

# Zip code validation
def local_zipcode(form, field):
    if field.data and not re.match(r'^\d{5}(-\d{4})?$', field.data):
        raise ValidationError('Invalid ZIP code format.')

class LoginForm(FlaskForm):
    """Login form."""
    
    username = StringField(
        "Username",
        validators=[InputRequired(), Length(min=5, max=20)],
        render_kw={"class": "form-control"}
    )
    password = PasswordField(
        "Password",
        validators=[InputRequired(), Length(min=6, max=100)],
        render_kw={"class": "form-control"}
    )
    submit = SubmitField('Login', render_kw={"class": "btn btn-primary"})

class SignupForm(FlaskForm):
    """User registration form."""

    username = StringField(
        "Username",
        validators=[InputRequired(), Length(min=5, max=20)],
        render_kw={"class": "form-control"}
    )
    password = PasswordField(
        "Password",
        validators=[InputRequired(), Length(min=6, max=100), password_strength],
        render_kw={"class": "form-control"}
    )
    confirm_password = PasswordField(
        "Confirm Password",
        validators=[InputRequired(), EqualTo('password', message="Passwords must match")],
        render_kw={"class": "form-control"}
    )
    email = StringField(
        "Email",
        validators=[InputRequired(), Email(), Length(max=100)],
        render_kw={"class": "form-control"}
    )
    local_zipcode = StringField(
        "Zipcode",
        validators=[Optional(), local_zipcode],
        render_kw={"class": "form-control"}
    )
    first_name = StringField(
        "First Name",
        validators=[InputRequired(), Length(max=30)],
        render_kw={"class": "form-control"}
    )
    last_name = StringField(
        "Last Name",
        validators=[InputRequired(), Length(max=30)],
        render_kw={"class": "form-control"}
    )
    submit = SubmitField('Sign Up', render_kw={"class": "btn btn-primary"})

class CommentForm(FlaskForm):
    """Add comments form."""
    
    title = StringField(
        "Title",
        validators=[InputRequired(), Length(max=100)],
        render_kw={"class": "form-control"}
    )
    content = StringField(
        "Content",
        validators=[InputRequired()],
        render_kw={"class": "form-control"}
    )
    submit = SubmitField('Post Comment', render_kw={"class": "btn btn-primary"})

class DeleteForm(FlaskForm):
    """Delete form -- this form is intentionally blank."""
    submit = SubmitField('Confirm Deletion', render_kw={"class": "btn btn-danger"})

