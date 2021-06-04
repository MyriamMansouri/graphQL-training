import { getFirstName, isValidPassword } from '../src/utils/user';

test('Should return first name when given full name', () => {
    const firstName = getFirstName('Lady Gaga')
    expect(firstName).toBe('Lady')
})

test('Should return first name when given first name', ()=> {
    const firstName = getFirstName('Lady')
    expect(firstName).toBe('Lady')
})

test('Should return first name when given first name', ()=> {
    const firstName = getFirstName('Lady')
    expect(firstName).toBe('Lady')
})

test('Should rejects passwords with less than 8 characters', ()=> {
    const isCurrentPasswordValid = isValidPassword('hello')
    expect(isCurrentPasswordValid).toBe(false)
})

test('Should rejects passwords that contains word "password"', ()=> {
    const isCurrentPasswordValid = isValidPassword('ddddpassword')
    expect(isCurrentPasswordValid).toBe(false)
})

test('Should rejects passwords equal to "passWorD"', ()=> {
    const isCurrentPasswordValid = isValidPassword('password')
    expect(isCurrentPasswordValid).toBe(false)
})