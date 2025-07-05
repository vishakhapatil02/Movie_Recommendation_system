let db=require("../config/db");

exports.registeruserIn=(username,email,password,role)=>{
    let sql="insert into users  (username,email,password,role) values (?,?,?,?)";

    return new Promise((resolve,reject)=>{
        db.query(sql,[username,email,password,role],(err,result)=>{
            if(err)
            {
                return reject(err);
            }
            else{
            resolve(result);
            }
        })
    })       
}
//find the duplicate users in it
exports.findUserByEmailAndUsername = (email, username) => {
    let sql = "SELECT * FROM users WHERE email = ? OR username = ? " ;
    
    return new Promise((resolve, reject) => {
        db.query(sql, [email, username ], (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result.length > 0 ? result[0] : null);
            }
        });
    });
};


//used to check the user login details
exports.findUserByEmail = (email) => {
  let sql = "SELECT user_id, username, email, password, role FROM users WHERE email = ?";
  return new Promise((resolve, reject) => {
    db.query(sql, [email], (err, result) => {
      if (err) return reject(err);
      resolve(result.length > 0 ? result[0] : null);
    });
  });
};


exports.incrementLoginCount = (email) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE users SET login_count = login_count + 1 WHERE email = ?`;
    db.query(sql, [email], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
exports.getUserAndLoginCounts = (userSql, loginSql) => {
  return new Promise((resolve, reject) => {
    db.query(userSql, (err1, res1) => {
      if (err1) return reject(err1);

      db.query(loginSql, (err2, res2) => {
        if (err2) return reject(err2);

        // Make sure to access values correctly
        resolve({
          totalUsers: res1[0].totalUsers || 0,
          totalLogins: res2[0].totalLogins || 0
        });
      });
    });
  });
};

exports.viewUseList=()=>{
    return new Promise((resolve,reject)=>{
        let sql='select * from users';
        db.query(sql,(err,result)=>{
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

exports.searchMoviesByFields = (query, callback) => {
  const searchQuery = `
    SELECT * FROM movies
    WHERE 
      title LIKE ? OR 
      genre LIKE ? OR 
      director LIKE ? OR 
      language LIKE ?
  `;
  const wildcardQuery = `%${query}%`;
  const params = [wildcardQuery, wildcardQuery, wildcardQuery, wildcardQuery];

  db.query(searchQuery, params, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};


exports.getPopularMovies = () => {
  return db.query(`
    SELECT *
    FROM movies
    WHERE rating >= 4
    ORDER BY rating DESC
    LIMIT 20
  `)
  .then(([results]) => results)
  .catch((err) => {
    console.error("❌ Error in getPopularMovies:", err);
    throw err;
  });
};

