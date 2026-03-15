// Kafka is disabled until Upstash is configured
const dummyProducer = {
  send: async () => {},
  connect: async () => {},
  disconnect: async () => {}
};

module.exports = { producer: dummyProducer };
