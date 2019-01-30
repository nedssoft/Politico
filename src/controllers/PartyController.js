import PartyModel from '../models/PartyModel';


class PartyController {
  static create(req, res) {
    const { name, hqAddress, logoUrl } = req.body;
    const newParty = {
      id: PartyModel.length + 1,
      name,
      hqAddress,
      logoUrl,
    };
    PartyModel.push(newParty);
    return res.status(201).json({
      status: 201,
      message: 'Ok',
      data: [newParty],
    });
  }

  static edit(req, res) {
    const { partyIndex, name } = req.body;
    const party = PartyModel[partyIndex];
    party.name = name;
    return res.status(200).json({
      status: 200,
      data: party,
    });
  }
}
export default PartyController;
