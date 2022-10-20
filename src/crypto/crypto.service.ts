export class CryptoSerivce {
    private bcrypt = require('bcryptjs');
    constructor() { }
    async Encryption(name, text?, key?) {
        const salt = await this.bcrypt.genSalt(10);
        const hashPassword = await this.bcrypt.hash(text, salt)
        const user = {
            name: name,
            password: hashPassword
        }
        return user;
    }
    async checkPassword(text?, encryptPassword?){
        const check = await this.bcrypt.compare(text, encryptPassword)
        // const user = {
        //     name: name,
        //     password: 
        // }
        return check;
    }
    async Decryption(text?, key?) {
        // const hash = bcrypt.hashSync(text, 10);
        // // const validPassword = await bcrypt.compare(req.body.password, user.password);
        // // if (!validPassword) {
        // //     return res.status(400).send('이메일이나 비밀번호가 올바르지 않습니다.');
        // // }
        // const match = await bcrypt.compare(key, hash)
        // // if (match) {
        // //     //login
        // // }
        // return match;
    }
}