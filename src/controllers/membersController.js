import MemberModel from '../models/MemberModel';

exports.getMembers = async (req, res) => {
  res.json((await MemberModel.find({}).exec()).filter((el) => !!el));
};

exports.addMember = async (req, res) => {
  const {
    firstName,
    lastName,
    birthDate,
    email,
    directionId,
    sex,
    education,
    universityAverageScore,
    mathScore,
    address,
    mobilePhone,
    skype,
    startDate,
  } = req.body;

  let memberModel = await MemberModel.create({
    firstName,
    lastName,
    birthDate,
    email,
    directionId,
    sex,
    education,
    universityAverageScore,
    mathScore,
    address,
    mobilePhone,
    skype,
    startDate,
  });
  res.json(memberModel);
};

exports.editMember = async (req, res) => {
  const memberData = req.body;

  const memberId = req.params.id;

  const editObject = {};
  Object.entries(memberData).forEach(([name, value]) => {
    if (value) {
      editObject[name] = value;
    }
  });

  let memberModel = await MemberModel.findByIdAndUpdate(memberId, editObject);

  res.json(memberModel);
};
