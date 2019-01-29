import PartyModel from '../models/Party';


class PartyController {
  static create(req, res) {
    const { name, hqAddress, logoUrl } = req.body;
    const partyExists = PartyModel.find(party => (
      party.name.toLowerCase() === name.toLowerCase()
    ));
    if (partyExists) {
      return res.status(400).json({
        status: 400,
        error: 'The party already exists',
      });
    }
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
}
export default PartyController;
