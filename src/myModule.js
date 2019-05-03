// Name export - Has a name. Have as many as needed.
// Default export - Has no name. You can only have one.

const message = 'some message from myModele'

const name = 'CH'

const location = 'Taipei'

const getGreeting = (name) => {
    return `Welcome to the course ${name}`
}

export { message, name, getGreeting, location as default }
