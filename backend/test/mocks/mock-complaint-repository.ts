export const MockWildlifeComplaintRepository = () => ({
   find: jest.fn().mockReturnThis(),
   createQueryBuilder: jest.fn(() => ({
     select: jest.fn().mockReturnThis(),
     distinct: jest.fn().mockReturnThis(),
     leftJoinAndSelect: jest.fn().mockReturnThis(),
     where: jest.fn().mockReturnThis(),
     orderBy: jest.fn().mockReturnThis(),
   })),
 });

 export const MockAllegationComplaintRepository = () => ({
   find: jest.fn().mockReturnThis(),
   createQueryBuilder: jest.fn(() => ({
     select: jest.fn().mockReturnThis(),
     distinct: jest.fn().mockReturnThis(),
     leftJoinAndSelect: jest.fn().mockReturnThis(),
     where: jest.fn().mockReturnThis(),
     orderBy: jest.fn().mockReturnThis(),
   })),
 });

 export const MockComplaintRepository = () => ({
   find: jest.fn().mockReturnThis(),
   createQueryBuilder: jest.fn(() => ({
     select: jest.fn().mockReturnThis(),
     distinct: jest.fn().mockReturnThis(),
     leftJoinAndSelect: jest.fn().mockReturnThis(),
     where: jest.fn().mockReturnThis(),
     orderBy: jest.fn().mockReturnThis(),
   })),
 });