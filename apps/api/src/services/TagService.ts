/** @format */

import UrgentTagModel from '@app/models/UrgentTagModel';
import logger from '@app/loaders/logger';

class TagService {
  async createTag(reqData): Promise<any> {
    try {
      const { title, description, userId } = reqData
      const searchTag = await UrgentTagModel.find({ title: title, userId: userId });
      if (searchTag.length === 0) {
        const Tag = await UrgentTagModel.create({ title, description, userId: userId });
        return { error: false, msg: 'success' };
      } else {
        logger.error(`UrgentTagService -> createTag -> duplicate key error`);
        return { error: true, msg: 'Tag with this title already exists' };
      }
    } catch (error) {
      logger.error(`UrgentTagService -> createTag -> error: ${error.message}`);
      return { error: true, msg: 'Internal server error' };
    }
  }
  async deleteTag(reqData): Promise<any> {
    try {
      const delTag = await UrgentTagModel.findByIdAndDelete(reqData['_id']);
      return { error: false, msg: 'success' };
    } catch (error) {
      logger.error(
        `UrgentTagService -> deleteTag -> error: ${error.message}`
      );
      return { error: true, msg: 'Internal server error' };
    }
  }

  async getTagBySearch(reqData): Promise<any> {
    try {
      const regexPattern = { $regex: reqData["input"], $options: 'i' }
      const getTag = await UrgentTagModel.find({
        userId: reqData["userId"],
        $or: [
          { title: regexPattern },
          { description: regexPattern }
        ]
      });
      // @ts-ignore
      if (getTag !== []) {
        return { error: false, msg: 'success', data: getTag };
      } else {
        return { error: false, msg: 'Tag not found' };
      }
    } catch (error) {
      logger.error(
        `UrgentTagService -> getTagBySearch -> error: ${error.message}`
      );
      return { error: true, msg: 'Internal server error' };
    }
  }

  async getAllTags(reqData): Promise<any> {
    try {
      const getAllTags = await UrgentTagModel.find({ userId: reqData["userId"] })
      if (getAllTags) {
        return { error: false, msg: 'success', data: getAllTags }
      } else {
        return { error: false, msg: 'No Tag exist' }
      }
    } catch (error) {
      logger.error(
        `UrgentTagService -> getAllTags -> error: ${error.message}`
      );
      return { error: true, msg: 'Internal server error' };
    }
  }

  async editTag(reqData): Promise<any> {
    try {
      if (reqData._id) {
        const searchTag = await UrgentTagModel.find({ title: reqData.title });
        console.log(searchTag)
        if (searchTag.length === 0 || (searchTag.length === 1 && searchTag[0]._id.toString() === reqData._id)) {
          const editTag = await UrgentTagModel.findByIdAndUpdate(
            reqData._id,
            reqData
          );
          return { error: false, msg: 'success', data: reqData };
        } else {
          logger.error(`UrgentTagService -> createTag -> duplicate key error`);
          return { error: true, msg: 'Tag with this title already exists' };
        }
      } else {
        logger.error(`TagService -> editTag -> missing _id`);
        return { error: true, msg: 'Internal server error' };
      }
    } catch (error) {
      logger.error(`UrgentTagService -> createTag -> error: ${error.message}`);
      return { error: true, msg: 'Internal server error' };
    }
  }
}

export default new TagService();
