// For development use only

const accounts = [
   {
      id: 'kajnfkjan193i139',
      name: 'ADMIN',
      role: 'teacher'
   },
   {
      id: '01930913adnjkasdnk',
      name: 'Student 1',
      role: 'student'
   }
]

function getRole(idUser){
   return new Promise((resolve, reject) => {
      var result = accounts.find(item => item.id === idUser);

      if(!result){
         return reject(new Error('unauthorized'));
      }

      return resolve(result.role);
   }); 
}

function getDetail(idUser){
   return new Promise((resolve, reject) => {
      var result = accounts.find(item => item.id === idUser);

      if(!result){
         return reject(new Error('unauthorized'));
      }

      return resolve(result);
   });
}

module.exports = { getDetail, getRole }