import { v4 as uuid } from "uuid";
import { dms } from "../database/models";
import Queries from "./Queries";
import { sendDmNotification } from '../helpers/socketIoSetup';

class DmService {
  /**
   * New DM creation method
   * @static
   * @param {object} req  request object
   * @memberof DmService
   * @returns {object} data
   */
  static async createNewDm(req) {
    const { user: { id, username }} = req;
    const { receiverId, message,socketId } = req.body;
    //console.log(receiverId)
    const newDmObject = {
      id: uuid(),
      creatorId: id,
      senderId: id,
      receiverId,
      message
    };
    console.log(socketId)
    const newDm = await Queries.create(dms, newDmObject);

    sendDmNotification(receiverId, newDm.dataValues,socketId);
    return newDm;
  }

  


}
export default DmService;
