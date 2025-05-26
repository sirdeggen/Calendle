import { post } from '../common/post';

export const upsert_solution = async (date, board) => {
    
    const uri = "/.netlify/functions/upsert_solution";
    const body = { date: date, board: board }

    return post(uri, body)
        .then((results) => {
            console.log("Results: ", results);
            return results;
        })
        .catch((error) => {
            console.error("Error: ", error);
        });
}