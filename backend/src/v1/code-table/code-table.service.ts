import { Injectable } from "@nestjs/common";

@Injectable()
export class CodeTableService {
  findAll() {
    return `This action returns all codeTable`;
  }

  // create(createCodeTableDto: CreateCodeTableDto) {
  //   return 'This action adds a new codeTable';
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} codeTable`;
  // }

  // update(id: number, updateCodeTableDto: UpdateCodeTableDto) {
  //   return `This action updates a #${id} codeTable`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} codeTable`;
  // }
}
