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
      bus_factor_lat,
      correctness,
      correctness_lat,
      dependency,
      dependency_lat,
      license,
      license_lat,
      net_score,
      net_score_lat,
      pull_request,
      pull_request_lat,
      ramp_up,
      ramp_up_lat,
      responsiveness,
      responsiveness_lat,
    } = Item;

    let data = {
      BusFactor: Number(bus_factor.toFixed(3)) || 0,
      BusFactorLatency: Number(bus_factor_lat.toFixed(3)) || 0,
      Correctness: Number(correctness.toFixed(3)) || 0,
      CorrectnessLatency: Number(correctness_lat.toFixed(3)) || 0,
      RampUp: Number(ramp_up.toFixed(3)) || 0,
      RampUpLatency: Number(ramp_up_lat.toFixed(3)) || 0,
      ResponsiveMaintainer: Number(responsiveness.toFixed(3)) || 0,
      ResponsiveMaintainerLatency: Number(responsiveness_lat.toFixed(3)) || 0,
      LicenseScore: Number(license.toFixed(3)) || 0,
      LicenseScoreLatency: Number(license_lat.toFixed(3)) || 0,
      GoodPinningPractice: Number(dependency.toFixed(3)) || 0,
      GoodPinningPracticeLatency: Number(dependency_lat.toFixed(3)) || 0,
      PullRequest: Number(pull_request.toFixed(3)) || 0,
      PullRequestLatency: Number(pull_request_lat.toFixed(3)) || 0,
      NetScore: Number(net_score.toFixed(3)) || 0,
      NetScoreLatency: Number(net_score_lat.toFixed(3)) || 0,
    }

    const output = data;
    return output;

  } catch (error: any) {
    throw new Error('Error: ' + error);
  }
};