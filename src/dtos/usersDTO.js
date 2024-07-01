export default class UserDto {
    constructor(user) {
        this.fullName = `${user.firstName} ${user.lastName}`;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.age = user.age;
        this.email = user.email;
        this.password = user.password;
        this.cartId = user.cartId;
    }
}
