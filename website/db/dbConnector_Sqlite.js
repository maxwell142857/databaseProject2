const { MongoClient } = require('mongodb');

// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/project2';

// Function to connect to MongoDB
async function connect() {
  const client = new MongoClient(mongoURI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client;  // Return the MongoClient instance
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

async function getTrips() {
  const db = await connect();
  try {
    const trips = await db.all(`SELECT ride_id, 
      start_station_name, 
      end_station_name, 
      started_at, 
      ended_at,
      rideable_type
    FROM  trips
    ORDER BY ride_id DESC
    LIMIT 20;
    `);

    console.log("dbConnector got data", trips.length);

    return trips;
  } finally {
    await db.close();
  }
}

async function getTrip(ride_id) {
  console.log("Get trip ride_id", ride_id);
  const db = await connect();
  try {
    const stmt = await db.prepare(`SELECT 
    ride_id, 
    start_station_name, 
    end_station_name, 
    started_at, 
    ended_at,
    rideable_type
  FROM trips
  WHERE 
    ride_id = :ride_id    
  `);

    stmt.bind({ ":ride_id": ride_id });

    const trips = await stmt.all();

    await stmt.finalize();

    return trips;
  } finally {
    await db.close();
  }
}

async function updateTrip(ride_id, newRide) {
  console.log("update trip ride_id", ride_id);
  const db = await connect();
  try {
    const stmt = await db.prepare(`UPDATE trips  
    SET
      start_station_name = :start_station_name,
      end_station_name = :end_station_name, 
      started_at = :started_at, 
      ended_at = :ended_at,
      rideable_type = :rideable_type
  WHERE 
    ride_id = :ride_id    
  `);

    stmt.bind({
      ":ride_id": ride_id,
      ":end_station_name": newRide.end_station_name,
      ":start_station_name": newRide.start_station_name,
      ":started_at": newRide.started_at,
      ":ended_at": newRide.ended_at,
      ":rideable_type": newRide.rideable_type,
    });

    const result = await stmt.run();

    await stmt.finalize();

    return result;
  } finally {
    await db.close();
  }
}

async function deleteTrip(ride_id) {
  console.log("update trip ride_id", ride_id);
  const db = await connect();
  try {
    const stmt = await db.prepare(`DELETE FROM trips      
  WHERE 
    ride_id = :ride_id    
  `);

    stmt.bind({
      ":ride_id": ride_id,
    });

    const result = await stmt.run();

    await stmt.finalize();

    return result;
  } finally {
    await db.close();
  }
}

async function createTrip( newRide) {
  console.log("create trip newRide", newRide);
  const db = await connect();
  try {
    const stmt = await db.prepare(`INSERT INTO trips 
      (start_station_name, end_station_name, started_at, ended_at, rideable_type)
    VALUES
      ( 
        :start_station_name,
        :end_station_name, 
        :started_at, 
        :ended_at,
        :rideable_type
      )
  `);

    stmt.bind({
      ":end_station_name": newRide.end_station_name,
      ":start_station_name": newRide.start_station_name,
      ":started_at": newRide.started_at,
      ":ended_at": newRide.ended_at,
      ":rideable_type": newRide.rideable_type,
    });

    const result = await stmt.run();

    await stmt.finalize();

    return result;
  } finally {
    await db.close();
  }
}


// ******* COMMENTS *********

async function getComment(comment_id) {
  console.log("Get comment comment_id", comment_id);
  const db = await connect();
  try {
    const stmt = await db.prepare(`SELECT 
    ride_id,
    comment_id,
    comment 
  FROM comments
  WHERE 
    comment_id = :comment_id    
  `);

    stmt.bind({ ":comment_id": comment_id });

    const comments = await stmt.all();

    await stmt.finalize();

    return comments;
  } finally {
    await db.close();
  }
}

async function getComments(ride_id) {
  console.log("Get comments for ride_id", ride_id);
  const db = await connect();
  try {
    const stmt = await db.prepare(`SELECT 
    ride_id,
    comment_id,
    comment 
  FROM comments
  WHERE 
    ride_id = :ride_id    
  `);

    stmt.bind({ ":ride_id": ride_id });

    const comments = await stmt.all();

    await stmt.finalize();

    return comments;
  } finally {
    await db.close();
  }
}

// Update one comment
async function updateComment(comment_id, newComment) {
  console.log("update comment comment_id", comment_id);
  const db = await connect();
  try {
    const stmt = await db.prepare(`UPDATE comments  
    SET
      comment = :comment
  WHERE 
    comment_id = :comment_id    
  `);

    stmt.bind({
      ":comment_id": comment_id,
      ":comment": newComment.comment,
    });

    const result = await stmt.run();

    await stmt.finalize();

    return result;
  } finally {
    await db.close();
  }
}

// Delete one comment
async function deleteComment(comment_id) {
  console.log("Delete comment comment_id", comment_id);
  const db = await connect();
  try {
    const stmt = await db.prepare(`DELETE FROM comments  
  WHERE 
    comment_id = :comment_id    
  `);

    stmt.bind({
      ":comment_id": comment_id,
    });

    const result = await stmt.run();

    await stmt.finalize();

    return result;
  } finally {
    await db.close();
  }
}


async function createComment( newComment) {
  console.log("create comment newComment", newComment);
  const db = await connect();
  try {
    const stmt = await db.prepare(`INSERT INTO comments 
      (ride_id, comment)
    VALUES
      ( 
        :ride_id,
        :comment
      )
  `);

    stmt.bind({
      ":ride_id": newComment.ride_id,
      ":comment": newComment.comment
    });

    const result = await stmt.run();

    await stmt.finalize();

    return result;
  } finally {
    await db.close();
  }
}

// start my code
async function getTitles() {
  const client = await connect();
  try {
    const titles = await client.db().collection('Title').find().toArray();
    return titles;
  } finally {
    await client.close();
  }
}


async function getTitle(titleID) {
  const client = await connect();
  try {
    const title = await client.db().collection('Title').findOne({ titleID: parseInt(titleID) });
    return [title]; 
  } finally {
    await client.close();
  }
}


async function updateTitle(titleID, newTitle) {
  const client = await connect();
  try {
    const result = await client
      .db()
      .collection('Title')
      .updateOne(
        { titleID: parseInt(titleID) },
        {
          $set: {
            title: newTitle.title,
            author: newTitle.author,
            genre: newTitle.genre,
          },
        }
      );

    return result;
  } finally {
    await client.close();
  }
}


async function deleteTitle(titleID) {
  const client = await connect();
  try {
    const result = await client.db().collection('Title').deleteOne({titleID: parseInt(titleID) });
    console.log(result)
    return result; 
  } finally {
    await client.close();
  }
  
}

async function deleteCopy(titleID) {
  const db = await connect();
  try {
    const stmt = await db.prepare(`DELETE FROM Copy      
  WHERE 
    titleID = :titleID    
  `);

    stmt.bind({
      ":titleID": titleID,
    });

    const result = await stmt.run();

    await stmt.finalize();

    return result;
  } finally {
    await db.close();
  }
}

async function createTitle( newTitle) {
  const client = await connect();
  
  try {
    const titleCnt = await client.db().collection('Title').countDocuments();
    console.log(titleCnt)
    const result = await client.db().collection('Title').insertOne({
      title: newTitle.title,
      author: newTitle.author,
      genre: newTitle.genre,
      titleID: titleCnt+1
    });
    
    return result; 
  } finally {
    await client.close();
  }

  
}


async function getCopies(titleID) {
  const client = await connect();
  try {
    const title = await client.db().collection('Title').findOne({ titleID: parseInt(titleID) });
    return title.copies; 
  } finally {
    await client.close();
  }
}

module.exports = {
  getTrips,
  getTrip,
  updateTrip,
  deleteTrip,
  createTrip,
  getComments,
  getComment,
  updateComment,
  deleteComment,
  createComment,
  //
  getTitles,
  getTitle,
  updateTitle,
  deleteTitle,
  deleteCopy,
  createTitle,
  getCopies
}
