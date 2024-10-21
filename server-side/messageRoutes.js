const { User, Room, Message, RoomMember } = require('./models');

const router = require('express').Router();

router.get('/:roomId/messages',
    async(req, res) => {
        const roomId = req.params.roomId;

        const messages = await Message.findAll({
            where: { roomId }
        });

        return res.status(200).json(messages);
    }
)
module.exports = router;