const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/bookin');

const events = eventIds => {
    return Event.find({ _id: { $in: eventIds }})
        .then(events => {
            return events.map(event => {
                return {
                    ...event._doc,
                    _id: event.id,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event.creator)
                }
            })
        })
        .catch(err => { throw err; })
}

const user = userId => {
    return User.findById(userId)
        .then(user => {
            return {
                ...user._doc,
                _id: user.id,
                createdEvents: events.bind(this, user._doc.createdEvents)
            }
        })
        .catch(err => { throw err; })
}

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId)
        return {
            ...event._doc,
            _id: event.id,
            creator: user.bind(this, event.creator)
        }
    } catch (err) {
        throw err;
    }
}

module.exports = {
    events: () => {
        return Event.find()
            .then(events => {
                return events.map(event => {
                    return {
                        ...event._doc,
                        _id: event.id,
                        date: new Date(event._doc.date).toISOString(),
                        creator: user.bind(this, event._doc.creator)
                    }
                })
            })
            .catch(err => { throw err; })
    },
    bookings: async () => {
        try {
            const bookings = await Booking.find();

            return bookings.map(booking => {
                return {
                    ...booking._doc,
                    _id: booking.id,
                    user: user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString(),
                }
            })
        } catch (err) {
            throw err;
        }
    },
    createEvent: (args) => {
        const { title, description, price, date } = args.eventInput;

        const event = new Event({
            title,
            description,
            price: +price,
            date: new Date(date),
            creator: '5d5bc1557cdeb9a6bb5e0387'
        });

        let createdEvent;

        return event
            .save()
            .then(result => {
                createdEvent = {
                    ...result._doc,
                    _id: result._doc._id.toString(),
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, result._doc.creator)
                }
                
                console.log('save event succeded', result);
                return User.findById('5d5bc1557cdeb9a6bb5e0387')
            })
            .then(user => {
                if (!user) {
                    throw new Error('User not found.');
                }

                user.createdEvents.push(event);
                return user.save();
            })
            .then(() => {
                return createdEvent
            })
            .catch(err => {
                console.log('save event error', err);
                throw err;
            });
    },
    createUser: args => {
        return User.findOne({ email: args.userInput.email })
            .then(user => {
                if (user) {
                    throw new Error('User exist already.');
                }

                return bcrypt.hash(args.userInput.password, 12);
            })
            .then(hashPassword => (
                new User({
                    email: args.userInput.email,
                    password: hashPassword
                }).save()
            ))
            .then(({ _doc, id }) => ({..._doc, password: null, _id: id }))
            .catch(err => { throw err; })
    },
    bookEvent: async args => {
        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        const booking = new Booking({
            user: '5d5bc1557cdeb9a6bb5e0387',
            event: fetchedEvent
        });
        const result = await booking.save();

        console.log('::::::', booking)

        console.log('****', result)

        return {
            ...result._doc,
            _id: result.id,
            user: user.bind(this, booking._doc.user),
            event: singleEvent.bind(this, booking._doc.event),
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.updatedAt).toISOString(),
        }
    },
    cancelBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');

            const event = {
                ...booking.event._doc,
                _id: booking.event.id,
                creator: user.bind(this, booking.event._doc.creator),
            };

            await Booking.deleteOne({ _id: args.bookingId });

            return event;
        } catch (err) {
            throw err;
        }
    }
}

