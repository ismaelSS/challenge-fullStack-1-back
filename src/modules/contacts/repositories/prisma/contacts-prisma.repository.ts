import { Injectable } from '@nestjs/common'
import { ContactsRepository } from '../contacts.repositories'
import { CreateContactDto } from '../../dto/create-contact.dto'
import { UpdateContactDto } from '../../dto/update-contact.dto'
import { Contact } from '../../entities/contact.entity'
import { PrismaService } from 'src/datadase/prisma.service'
import { plainToInstance } from 'class-transformer'

@Injectable()
export class ContactsPrismaRepository implements ContactsRepository {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateContactDto, userId: string): Promise<Contact> {
    const contact = new Contact()
    Object.assign(contact, {
      ...data,
    })

    const newContact = await this.prisma.contact.create({
      data: { ...contact, userId },
    })

    delete newContact.userId

    return plainToInstance(Contact, newContact)
  }
  async findAll(): Promise<Contact[]> {
    const contacts = await this.prisma.contact.findMany()
    return plainToInstance(Contact, contacts)
  }

  async findAllUserContacts(userId: string): Promise<Contact[]> {
    const contacts = await this.prisma.contact.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone_number: true,
        created_at: true,
      },
    })
    return plainToInstance(Contact, contacts)
  }

  async findOne(id: string): Promise<Contact> {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone_number: true,
        created_at: true,
      },
    })
    return plainToInstance(Contact, contact)
  }
  // async findByEmail(email: string): Promise<Contact> {
  //   const contact = await this.prisma.contact.findUnique({
  //     where: { email },
  //   })
  //   return plainToInstance(Contact, contact)
  // }
  async update(id: string, data: UpdateContactDto): Promise<Contact> {
    const contact = await this.prisma.contact.update({
      where: { id },
      data: { ...data },
    })

    return plainToInstance(Contact, contact)
  }
  async delete(id: string): Promise<void> {
    await this.prisma.contact.delete({
      where: { id },
    })
  }
}
