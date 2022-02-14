import { v4 as uuid } from "uuid";
import { Op } from 'sequelize';
import { users, dms } from "../database/models";
import Queries from "./Queries";
import HashPassword from "../helpers/HashPassword";

class AuthService {
  /**
   * New account creation method
   * @static
   * @param {object} req  request object
   * @memberof AuthService
   * @returns {object} data
   */
  static async signup(req) {
    const { username, email, password } = req.body;
    const hashedPassword = HashPassword.hashPassword(password);
    const newUserObject = {
      id: uuid(),
      username,
      email,
      password: hashedPassword
    };
    const newUser = await Queries.create(users, newUserObject);
    return newUser;
  }

  /**
   * Retrieve All users on the system
   * @static
   * @param {object} req  request object
   * @memberof AuthService
   * @returns {object} retrievd all users
   */
  static async viewUsersAlongsideDms(req) {
    const { user: { id }} = req;
    const { receiverId } = req.body;
    const allUsers = await Queries.findAll(users, {
      where: { id: { [Op.ne]: id } },
      attributes: {
        exclude: ["password"],
      },
      include: [
           { 
             model: dms, as: 'dms', 
             required: false,
              where: {
                  receiverId: receiverId ,
                  senderId: id 
               }
           },
           {
              model: dms, as: 'dms', 
              required: false,
               where: {
                receiverId: id ,
                  senderId:  receiverId
              }
            }
      ],
      order: [["createdAt", "DESC"]]
    });
    return allUsers;
  }


}
export default AuthService;
