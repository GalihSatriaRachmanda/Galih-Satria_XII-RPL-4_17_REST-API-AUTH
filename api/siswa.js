const Cryptr = require('cryptr')
const cryptr = new Cryptr("6969696809")
module.exports =
  function(app, db) {
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

    app.get("/siswa", validateToken(), (req, res) => {
      let sql = "select * from siswa";

      db.query(sql, (error, result) => {
        let response = null;
        if (error) {
          response = {
            message: error.message,
          };
        } else {
          response = {
            count: result.length,
            siswa: result,
          };
        }
        res.json(response);
      });
    });

    app.get("/siswa/:id", validateToken(), (req, res) => {
      let data = {
        id_siswa: req.params.id,
      };

      let sql = "select * from siswa where ?";

      db.query(sql, data, (error, result) => {
        let response = null;
        if (error) {
          response = {
            message: error.message,
          };
        } else {
          response = {
            count: result.length,
            siswa: result,
          };
        }
        res.json(response);
      });
    });

    app.post("/siswa", validateToken(), (req, res) => {
      let data = {
        nis: req.body.nis,
        nama_siswa: req.body.nama_siwa,
        kelas: req.body.kelas,
        poin: req.body.poin,
      };

      let sql = "insert into siswa set ?";

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

    app.put("/siswa", validateToken(), (req, res) => {
      let data = [{
          nis: req.body.nis,
          nama_siswa: req.body.nama_siswa,
          kelas: req.body.kelas,
          poin: req.body.poin,
        },
        {
          id_siswa: req.body.id_siswa,
        },
      ];

      let sql = "update siswa set ? where ?";

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

    app.delete("/siswa/:id", validateToken(), (req, res) => {
      let data = {
        id_siswa: req.params.id,
      };

      let sql = "delete from siswa where ?";

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
  }