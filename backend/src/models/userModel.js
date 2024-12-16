class UserModel{
    constructor(users){
        this.id = users.id,
        this.name = users.name,
        this.email = users.email,
        this.phone_no = users.phone_no,
        this.password = users.password
    }
}

module.exports = UserModel;