import { Op } from 'sequelize';
import type { WhereOptions } from 'sequelize';

export const createSearchFilter = (search: string, fields: string[],
    operator: 'and' | 'or' = 'and'
    ): WhereOptions | null => {
    if (!search || typeof search !== 'string') return null;

    const words = search.split(' ');

    const mainOperator = operator === 'and' ? Op.and : Op.or;

    return {
        [Op.or]: fields.map(field => ({
        [mainOperator]: words.map(word => ({
            [field]: { [Op.iLike]: `%${word}%` },
        })),
        })),
    };
};
