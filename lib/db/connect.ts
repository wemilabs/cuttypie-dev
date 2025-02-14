import mongoose from 'mongoose';

const MONGODB_URI = process.env.DATABASE_URL!;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the DATABASE_URL environment variable inside .env'
  );
}

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: GlobalMongoose | undefined;
}

const cached: GlobalMongoose = global.mongoose || {
  conn: null,
  promise: null,
};

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('\x1b[36m%s\x1b[0m', '🔌 Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    const mongooseInstance = await cached.promise;
    cached.conn = mongooseInstance;
    console.log('\x1b[32m%s\x1b[0m', '✅ Connected to MongoDB successfully!');
    return mongooseInstance;
  } catch (e) {
    cached.promise = null;
    console.error('\x1b[31m%s\x1b[0m', '❌ Error connecting to MongoDB:', e);
    throw e;
  }
}

// Listen for MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('\x1b[36m%s\x1b[0m', '📡 MongoDB connection established');
});

mongoose.connection.on('disconnected', () => {
  console.log('\x1b[33m%s\x1b[0m', '🔌 MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('\x1b[31m%s\x1b[0m', '❌ MongoDB connection error:', err);
});

export default connectDB;
