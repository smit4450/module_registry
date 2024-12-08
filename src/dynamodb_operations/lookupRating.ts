import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { PutCommand, GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import dynamodb from '../dynamodb.js';
import dotenv from 'dotenv';
import { c } from 'tar';
import { sizeCost } from './sizeCost';
import { version } from 'os';

dotenv.config();

// Set up AWS S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const lookupRating = async (package_id: string) => {
  try {
    const scanParams = {
      TableName: "packages_new",
      FilterExpression: "#id = :id",
      ExpressionAttributeNames: {
        "#id": "package_id",
      },
      ExpressionAttributeValues: {
        ":id": package_id,
      },
    };

    const scanResponse = await dynamodb.send(new ScanCommand(scanParams));
    const Item = scanResponse.Items?.[0];
    if (!Item) {
      throw new Error('Error: Package metadata not found in DynamoDB');
    }

    //console.log(Item); 

    const {
      bus_factor,
      correctness,
      dependency,
      license,
      net_score,
      pull_request,
      ramp_up,
      responsiveness,
    } = Item;

    let data = {
      BusFactor: Number(bus_factor.toFixed(3)) || -1,
      BusFactorLatency: -1,
      Correctness: Number(correctness.toFixed(3)) || -1,
      CorrectnessLatency: -1,
      RampUp: Number(ramp_up.toFixed(3)) || -1,
      RampUpLatency: -1,
      ResponsiveMaintainer: Number(responsiveness.toFixed(3)) || -1,
      ResponsiveMaintainerLatency: -1,
      LicenseScore: Number(license.toFixed(3)) || -1,
      LicenseScoreLatency: -1,
      GoodPinningPractice: Number(dependency.toFixed(3)) || -1,
      GoodPinningPracticeLatency: -1,
      PullRequest: Number(pull_request.toFixed(3)) || -1,
      PullRequestLatency: -1,
      NetScore: Number(net_score.toFixed(3)) || -1,
      NetScoreLatency: -1,
    }

    const output = data;
    return output;

  } catch (error: any) {
    throw new Error('Error: ' + error);
  }
};