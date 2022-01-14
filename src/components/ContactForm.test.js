import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm/>)
});

test('renders the contact form header', ()=> {
    render(<ContactForm/>)

    const headerElement= screen.queryByText(/Contact Form/);
    
    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toBeTruthy();
    expect(headerElement).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>)

    const firstName = screen.getByLabelText(/first Name*/i)
    userEvent.type(firstName, '123')

    const errorMessages = await screen.findAllByTestId('error');
    expect(errorMessages).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm/>);

    const submitButton = screen.getByRole('button');

    userEvent.click(submitButton);

    await waitFor(()=> {
        const errorMessages = screen.queryAllByTestId('error');
        expect(errorMessages).toHaveLength(3)
    });
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>);

    const firstName = screen.getByLabelText(/first name/i);
    userEvent.type(firstName, 'Levis');
    const lastName = screen.getByLabelText(/last name*/i);
    userEvent.type(lastName, 'Smith');

    const button = screen.getByRole('button');
    userEvent.click(button)

    const errorMessages = await screen.getAllByTestId('error');
    expect(errorMessages).toHaveLength(1)
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm/>);

    const email = screen.getByLabelText(/email*/i)

    userEvent.type(email, 'Levisept@gmail')

    const errorMessage = await screen.findByText(/email must be a valid email address/i);
    expect(errorMessage).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>);
    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);

    const errorMessage = await screen.findByText(/lastName is a required field/i)
    expect(errorMessage).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>);

    const firstName = screen.getByLabelText(/first name*/i);
    const lastName = screen.getByLabelText(/last name*/i);
    const email = screen.getByLabelText(/email*/i);

    userEvent.type(firstName, 'Levis');
    userEvent.type(lastName, 'Smith');
    userEvent.type(email, 'levisept@gmail');

    const button = screen.getByRole('button');
    userEvent.click(button);

    await waitFor(()=> {
        const firstNameDisplay = screen.queryByText('Levis');
        const lastNameDisplay = screen.queryByText('Smith');
        const emailDisplay = screen.queryByText('levisept@gmail');
        const messageDisplay = screen.queryByTestId('messageDisplay');

        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).not.toBeInTheDocument();
    })
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>);

    const firstName = screen.getByLabelText(/first name*/i);
    const lastName = screen.getByLabelText(/last name*/i);
    const email = screen.getByLabelText(/email*/i)
    const messageField = screen.getByLabelText(/message/i)

    userEvent.type(firstName, 'Levi');
    userEvent.type(lastName, 'Smith');
    userEvent.type(email, 'levisept@gmail');
    userEvent.type(messageField, 'levismithmessage');

    const button = screen.getByRole('button')
    userEvent.click(button);

    await waitFor(()=> {
        const firstNameDisplay = screen.queryByText('Levi');
        const lastNameDisplay = screen.queryByText('Smith');
        const emailDisplay = screen.queryByText('levisept@gmail');
        const messageDisplay = screen.queryByText('levismithmessage');

        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).toBeInTheDocument();
    })
});