const md5 = require("md5");
const moment = require("moment");
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

        
        let decryptToken = cryptr.decrypt(token)

       
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

  app.post("/pelanggaran_siswa", validateToken(), (req, res) => {
    let data = {
      id_siswa: req.body.id_siswa,
      id_user: req.body.id_user,
      waktu: moment().format("YYYY-MM-DD HH:mm:ss"),
    };
    let pelanggaran = JSON.parse(req.body.pelanggaran);
    let sql = "insert into pelanggaran_siswa set ?";

    db.query(sql, data, (error, result) => {
      let response = null;

      if (error) {
        res.json({
          message: error.message
        });
      } else {
        let lastID = result.insertId;

        let data = [];
        for (let index = 0; index < pelanggaran.length; index++) {
          data.push([lastID, pelanggaran[index].id_pelanggaran]);
        }

        let sql = "insert into detail_pelanggaran_siswa values ?";

        db.query(sql, [data], (error, result) => {
          if (error) {
            res.json({
              message: error.message
            });
          } else {
            res.json({
              message: "Data Has Been Inserted!"
            });
          }
        });
      }
    });
  });
  app.get("/pelanggaran_siswa", validateToken(), (req, res) => {
    let sql = `select p.id_pelanggaran_siswa, p.id_siswa,p.waktu, s.nis, s.nama_siswa, p.id_user, u.nama_user
        from pelanggaran_siswa p join siswa s on p.id_siswa = s.id_siswa
        join user u on p.id_user = u.id_user`;

    db.query(sql, (error, result) => {
      if (error) {
        res.json({
          message: error.message
        });
      } else {
        res.json({
          count: result.length,
          pelanggaran_siswa: result,
        });
      }
    });
  });
  app.get("/pelanggaran_siswa/:id", validateToken(), (req, res) => {
    let param = {
      id_pelanggaran_siswa: req.params.id
    }

    let sql = "select p.nama_pelanggaran, p.poin " +
      "from detail_pelanggaran_siswa dps join pelanggaran p " +
      "on p.id_pelanggaran = dps.id_pelanggaran " +
      "where ?"

    db.query(sql, param, (error, result) => {
      if (error) {
        res.json({
          message: error.message
        })
      } else {
        res.json({
          count: result.length,
          detail_pelanggaran_siswa: result
        })
      }
    })
  })

  app.delete("/pelanggaran_siswa/:id", validateToken(), (req, res) => {
    let param = {
      id_pelanggaran_siswa: req.params.id
    }

    let sql = "delete from detail_pelanggaran_siswa where ?"

    db.query(sql, param, (error, result) => {
      if (error) {
        res.json({
          message: error.message
        })
      } else {
        let param = {
          id_pelanggaran_siswa: req.params.id
        }
      }

      let sql = "delete from pelanggaran_siswa where ?"

      db.query(sql, param, (error, result) => {
        if (error) {
          res.json({
            message: error.message
          })
        } else {
          res.json({
            message: "Data Has Been Deleted!"
          })
        }
      })

    })
  })
};