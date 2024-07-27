const Room = require('../models/Room');
const Student = require('../models/Student');
const Application = require('../models/Application');

const roomTypeFromCapacity = capacity => {
  if (capacity === 1) return 'Single';
  if (capacity === 2) return 'Double';
  if (capacity === 3) return 'Triple';
  if (capacity === 4) return 'Quad'; // Add other types as needed
  return 'Unknown';
};

class RoomAllocator {
  static async allocateRooms() {
    try {
      const applications = await Application.find({});
      const students = await Student.find({});
      const rooms = await Room.find({});

      if (!applications || !students || !rooms) {
        throw new Error('Failed to fetch applications, students, or rooms');
      }

      console.log('Fetched applications:', applications);
      console.log('Fetched students:', students);
      console.log('Fetched rooms:', rooms);

      const roomsByBlock = this.getRoomsByBlock(rooms);
      const allAvailableRooms = this.getAllAvailableRooms(rooms);

      if (!roomsByBlock || !allAvailableRooms) {
        throw new Error('Failed to group rooms or fetch available rooms');
      }

      console.log('Rooms by block:', roomsByBlock);
      console.log('All available rooms:', allAvailableRooms);

      // Step 1: Sort applications into preferred and non-preferred
      const [preferredApplications, nonPreferredApplications] = this.sortApplications(applications, students);

      // Step 2: Allocate rooms based on sorted applications
      await this.processApplications(preferredApplications, roomsByBlock, allAvailableRooms, students);
      await this.processApplications(nonPreferredApplications, roomsByBlock, allAvailableRooms, students);

      console.log('Room allocation complete.');
    } catch (error) {
      console.error('Error allocating rooms:', error.message || error);
    }
  }

  static sortApplications(applications, students) {
    const preferredApplications = [];
    const nonPreferredApplications = [];

    applications.forEach(application => {
      const student = students.find(s => s.rollNo === application.studentRollNo);
      if (student && student.preferredRoommatesRollNos && student.preferredRoommatesRollNos.length > 0) {
        preferredApplications.push(application);
      } else {
        nonPreferredApplications.push(application);
      }
    });

    return [preferredApplications, nonPreferredApplications];
  }

  static async processApplications(applications, roomsByBlock, allAvailableRooms, students) {
    for (let application of applications) {
      const student = students.find(s => s.rollNo === application.studentRollNo);

      if (student && student.paymentStatus === 'Paid' && !student.room) {
        console.log('Processing application:', application);

        if (student.preferredRoommatesRollNos && student.preferredRoommatesRollNos.length > 0) {
          await this.allocateWithPreferredRoommates(application, student, roomsByBlock, allAvailableRooms, students);
        } else {
          await this.allocateWithoutPreferredRoommates(application, student, roomsByBlock, allAvailableRooms);
        }
      }
    }
  }

  static async allocateWithPreferredRoommates(application, student, roomsByBlock, allAvailableRooms, students) {
    if (!student.preferredRoommatesRollNos) {
      console.warn('Student has no preferred roommates:', student);
      return;
    }

    const preferredRoommates = students.filter(s => student.preferredRoommatesRollNos.includes(s.rollNo));
    const paidRoommates = preferredRoommates.filter(rm => rm.paymentStatus === 'Paid' && !rm.room);

    const blockRooms = roomsByBlock[application.blockName] || [];
    if (!blockRooms) {
      console.warn('No rooms found for block:', application.blockName);
      return;
    }

    let roomAllocated = false;
    const applicationRoomType = application.roomType;

    for (let room of blockRooms) {
      if (!room.students) room.students = [];
      const roomType = room.capacity;

      // Check if there is enough space in the room
      if (room.students.length < room.capacity && roomType === applicationRoomType) {
        console.log(`Allocating room ${room.roomNo} in block ${room.blockName} to student ${student.rollNo}`);
        await this.allocateRoom(room, student);

        // Allocate preferred roommates if there is space left
        for (let roommate of paidRoommates) {
          if (room.students.length < room.capacity) {
            console.log(`Allocating room ${room.roomNo} in block ${room.blockName} to preferred roommate ${roommate.rollNo}`);
            await this.allocateRoom(room, roommate);
          }
        }
        roomAllocated = true;
        break;
      }
    }

    if (!roomAllocated) {
      console.log(`No room allocated in preferred block for student ${student.rollNo}. Trying available rooms.`);
      for (let room of allAvailableRooms) {
        if (!room.students) room.students = [];
        const roomType = room.capacity;

        // Check if there is enough space in the room
        if (room.students.length < room.capacity && roomType === applicationRoomType) {
          console.log(`Allocating available room ${room.roomNo} to student ${student.rollNo}`);
          await this.allocateRoom(room, student);

          // Allocate preferred roommates if there is space left
          for (let roommate of paidRoommates) {
            if (room.students.length < room.capacity) {
              console.log(`Allocating available room ${room.roomNo} to preferred roommate ${roommate.rollNo}`);
              await this.allocateRoom(room, roommate);
            }
          }
          break;
        }
      }
    }
  }

  static async allocateWithoutPreferredRoommates(application, student, roomsByBlock, allAvailableRooms) {
    const blockRooms = roomsByBlock[application.blockName] || [];
    if (!blockRooms) {
      console.warn('No rooms found for block:', application.blockName);
      return;
    }

    let roomAllocated = false;
    const applicationRoomType = application.roomType;

    for (let room of blockRooms) {
      if (!room.students) room.students = [];
      const roomType = room.capacity;

      // Check if there is enough space in the room
      if (room.students.length < room.capacity && roomType === applicationRoomType) {
        console.log(`Allocating room ${room.roomNo} in block ${room.blockName} to student ${student.rollNo}`);
        await this.allocateRoom(room, student);
        roomAllocated = true;
        break;
      }
    }

    if (!roomAllocated) {
      console.log(`No room allocated in preferred block for student ${student.rollNo}. Trying available rooms.`);
      for (let room of allAvailableRooms) {
        if (!room.students) room.students = [];
        const roomType = room.capacity;

        // Check if there is enough space in the room
        if (roomType === applicationRoomType && room.students.length < room.capacity) {
          console.log(`Allocating available room ${room.roomNo} to student ${student.rollNo}`);
          await this.allocateRoom(room, student);
          break;
        }
      }
    }
  }

  static getRoomsByBlock(rooms) {
    console.log('Grouping rooms by block.');
    return rooms.reduce((acc, room) => {
      if (!room.blockName) {
        console.warn('Room missing blockName:', room);
        return acc;
      }
      if (!acc[room.blockName]) acc[room.blockName] = [];
      acc[room.blockName].push(room);
      return acc;
    }, {});
  }

  static getAllAvailableRooms(rooms) {
    console.log('Fetching all available rooms.');
    return rooms.filter(room => room.students && room.students.length < room.capacity);
  }

  static async allocateRoom(room, student) {
    console.log(`Allocating room ${room.roomNo} to student ${student.rollNo}.`);
    if (!room.students) room.students = [];
    if (!room.students.includes(student._id)) {
      room.students.push(student._id);
    }
    student.room = room._id;
    await student.save();
    await room.save();
    console.log(`Student ${student.rollNo} allocated to room ${room.roomNo} in block ${room.blockName}.`);
  }
}

module.exports = RoomAllocator;
