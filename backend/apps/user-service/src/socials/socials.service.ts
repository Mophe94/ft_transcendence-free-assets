import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  Relationship,
  RelationshipStatus,
} from './entities/relationships.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/users.entity';

@Injectable()
export class SocialService {
  constructor(
    @InjectRepository(Relationship)
    private readonly repo: Repository<Relationship>,
  ) {}

  //   addFriend(asker: string, requeree: string) {
  //     const existing_relation = await this.repo.buildQuery();
  //     if (existing_relation) throw new UnauthorizedException("Invalid Request");
  //     this.repo.create()}

  async retrieveFriends(userId: string) {
    const relationships = await this.repo
      .createQueryBuilder('rel')
      .leftJoinAndSelect('rel.requester', 'requester')
      .leftJoinAndSelect('rel.accepter', 'accepter')
      .where('(rel.requesterId = :userId OR rel.accepterId = :userId)', {
        userId,
      })
      .andWhere('rel.status = :status', { status: RelationshipStatus.ACCEPTED })
      .getMany();
    return relationships.map((rel) =>
      rel.requesterId === userId
        ? rel.accepter
        : rel.accepterId === userId
          ? rel.requester
          : null,
    );
  }
  async createRequest(requesterId: string, accepterId: string) {
    const request = this.repo.create({ requesterId, accepterId });
    return await this.repo.save(request);
  }

  async checkExistingRequest(
    userId1: string,
    userId2: string,
  ): Promise<Relationship | null> {
    return await this.repo.findOne({
      where: [
        { requesterId: userId1, accepterId: userId2 },
        { requesterId: userId2, accepterId: userId1 },
      ],
    });
  }

  async getReceivedRequest(userId: string): Promise<Array<Partial<User>>> {
    return await this.repo
      .createQueryBuilder('relationship')
      .leftJoin('relationship.requester', 'requester')
      .select([
        'requester.id AS "id"',
        'requester.username AS "username"',
        'requester.avatarUrl AS "avatarUrl"',
        'requester.coalitionId AS "coalitionId"',
      ])
      .where('relationship.accepterId = :userId', { userId })
      .andWhere('relationship.status = :status', {
        status: RelationshipStatus.PENDING,
      })
      .getRawMany();
  }

  async acceptFriendRequest(requesterId: string, accepterId: string) {
    return await this.repo.update(
      { requesterId, accepterId },
      { status: RelationshipStatus.ACCEPTED },
    );
  }
  async deleteFriendRequest(userId1: string, userId2: string) {
    return await this.repo
      .createQueryBuilder()
      .delete()
      .from(Relationship)
      .where(
        '(requesterId = :userId1 AND accepterId = :userId2) OR (requesterId = :userId2 AND accepterId = :userId1)',
        { userId1, userId2 },
      )
      .execute();
  }
}
