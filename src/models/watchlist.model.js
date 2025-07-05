let db=require("../config/db");

exports.getAllMovies = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM movies";
    db.query(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

//Check if already exists in watchlist
exports.checkWatchlistExists = (user_id, movie_id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM watchlist WHERE user_id = ? AND movie_id = ?";
    db.query(sql, [user_id, movie_id], (err, results) => {
      if (err) reject(err);
      else resolve(results.length > 0);
    });
  });
};


exports.addTowatchlist=(user_id,movie_id)=>{
    return new Promise((resolve,reject)=>{
        let sql='insert into watchlist (user_id,movie_id)values(?,?)';
        db.query(sql,[user_id,movie_id],(err,result)=>{
            if(err)
            {
                reject(err);
            }
            else{
                resolve(result);
            }
        })
        })
}



exports.getwatlistMovies = (user_id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT m.* FROM watchlist w
      JOIN movies m ON w.movie_id = m.movie_id
      WHERE w.user_id = ?
    `;
    db.query(sql, [user_id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};



exports.removeFromWatchlist = (user_id, movie_id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?";
    db.query(sql, [user_id, movie_id], (err, result) => {
      if (err) return reject(err);
      resolve();
    });
  });
};
