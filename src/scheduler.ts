import cron from 'node-cron';
import Token from './models/token.model';
import { Op } from 'sequelize';

cron.schedule('0 0 * * *', async () => {
    try {
        await Token.destroy({
            where: {
                expiresAt: {
                    [Op.lt]: new Date(), 
                },
            },
        });
        console.log("Tokens expirados eliminados");
    } catch (error) {
        console.error("Error al eliminar tokens expirados:", error);
    }
});