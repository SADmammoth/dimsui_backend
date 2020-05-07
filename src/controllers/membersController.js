import MemberModel from '../models/MemberModel';

exports.getMembers = async (req, res) => {
  res.json((await MemberModel.find({}).exec()).filter((el) => !!el));
};

exports.addMember = async (req, res) => {
  const {
    firstName,
    birthDate,
    email,
    direction,
    sex,
    education,
    universityAverageScore,
    mathScore,
    address,
    mobilePhone,
    skype,
    startDate,
  } = req.body;

  let memberModel = await MemberModel.create(req.body);
  res.json(memberModel);
};
