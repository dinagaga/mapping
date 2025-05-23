import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://daiplatinue:passwordpassword@mappingdb.edejwt6.mongodb.net/?retryWrites=true&w=majority&appName=MappingDB')
  .then(() => { console.log('Connected!'); process.exit(0); })
  .catch(err => { console.error('Connection error:', err); process.exit(1); });