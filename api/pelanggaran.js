const Cryptr = require('cryptr')
const cryptr = new Cryptr("6969696809")
module.exports = function(app, db) {
  validateToken = () => {
    return (req, res, next) => {
    
      if (!req.get("Token")) {
      
        res.json({
          message: "Access Forbidden"
        })
      } else {
     
        let token = req.get("Token")

        
        let decryptToken = crypt.decrypt(token)

       
        let sql = "select * from user where ?"

       
        let param = {
          id_user: decryptToken
        }

      
        db.query(sql, param, (error, result) => {
          if (error) throw error
  
          if (result.length > 0) {
  
            next()
          } else {
  
            res.json({
              message: "Invalid Token"
            })
          }
        })
      }

    }
  }

  app.get("/pelanggaran", validateToken(), (req, res) => {
    let sql = "select * from pelanggaran";

    db.query(sql, (error, result) => {
      let response = null;
      if (error) {
        response = {
          message: error.message,
        };
      } else {
        response = {
          count: result.length,
          pelanggaran: result,
        };
      }
      res.json(response);
    });
  });

  app.get("/pelanggaran/:id", validateToken(), (req, res) => {
    let data = {
      id_pelanggaran: req.params.id,
    };

    let sql = "select * from pelanggaran where ?";

    db.query(sql, data, (error, result) => {
      let response = null;
      if (error) {
        response = {
          message: error.message,
        };
      } else {
        response = {
          count: result.length,
          pelanggaran: result,
        };
      }
      res.json(response);
    });
  });

  app.post("/pelanggaran", validateToken(), (req, res) => {
    let data = {
      nama_pelanggaran: req.body.nama_pelanggaran,
      poin: req.body.poin,
    };

    let sql = "insert into pelanggaran set ?";

    db.query(sql, data, (error, result) => {
      let response = null;
      if (error) {
        response = {
          message: error.message,
        };
      } else {
        response = {
          message: result.affectedRows + " Data Inserted!",
        };
      }
      res.json(response);
    });
  });

  app.put("/pelanggaran", validateToken(), (req, res) => {
    let data = [{
        nama_pelanggaran: req.body.nama_pelanggaran,
        poin: req.body.poin,
      },
      {
        id_pelanggaran: req.body.id_pelanggaran,
      },
    ];

    let sql = "update pelanggaran set ? where ?";

    db.query(sql, data, (error, result) => {
      let response = null;
      if (error) {
        response = {
          message: error.message,
        };
      } else {
        response = {
          message: result.affectedRows + " Data Updated!",
        };
      }
      res.json(response);
    });
  });

  app.delete("/pelanggaran/:id", validateToken(), (req, res) => {
    let data = {
      id_pelanggaran: req.params.id_pelanggaran,
    };

    let sql = "delete from pelanggaran where ?";

    db.query(sql, data, (error, result) => {
      let response = null;
      if (error) {
        response = {
          message: error.message,
        };
      } else {
        response = {
          message: result.affectedRows + " Data Deleted!",
        };
      }
      res.json(response);
    });
  });
};