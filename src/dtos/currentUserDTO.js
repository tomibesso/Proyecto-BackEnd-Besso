export default class currentUserDto {
    constructor(user) {
        this.email = user.email;
        this.id = user.id;
        this.role = user.role;
    }
}