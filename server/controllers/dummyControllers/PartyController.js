import PartyModel from '../../models/dummyModels/PartyModel';


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
        error: `Party with ID: ${partyId} Not Found`,
      });
    }
  }

  static all(req, res) {
    return res.status(200).json({
      status: 200,
      data: PartyModel,
    });
  }

  static deleteParty(req, res) {
    const { partyIndex } = req.body;

    PartyModel.splice(partyIndex, 1);
    return res.status(200).json({
      status: 200,
      data: [{ message: 'success' }],
    });
  }
}

export default PartyController;
