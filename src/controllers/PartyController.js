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

  static getAParty(req, res) {
    const { partyId } = req.params;
    const party = PartyModel.find(partyR => (
      partyR.id === Number(partyId)
    ));
    if (party) {
      res.status(200).json({
        status: 200,
        data: party,
      });
    } else {
      return res.status(404).json({
        status: 404,
        error: 'Not Found',
      });
    }
  }
}

export default PartyController;
