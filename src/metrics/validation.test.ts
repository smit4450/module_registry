import '../index.ts';
import 'Phase1/Group15/src/api_handler/graphql_handler/analyzer_graphql.ts';

// GitHub URL validation test
describe('GitHub GraphQL URL Validation', () => {
    const GITHUB_GRAPHQL_URL_PATTERN = /^https:\/\/api\.github\.com\/graphql$/;
  
    function isValidGitHubGraphQLUrl(url: string): boolean {
      return GITHUB_GRAPHQL_URL_PATTERN.test(url);
    }
  
    test('Valid GitHub GraphQL URL', () => {
      const validUrl = "https://api.github.com/graphql";
      expect(isValidGitHubGraphQLUrl(validUrl)).toBe(true);
    });
  
    test('Invalid GitHub GraphQL URL', () => {
      const invalidUrl = "https://api.github.com/rest";
      expect(isValidGitHubGraphQLUrl(invalidUrl)).toBe(false);
    });
  });
  
// Bus Factor validation test
// describe('Bus Factor Validation', () => {
//     function bus_factor(): number {
//     // Placeholder for actual logic

//     return 3;
// }

// test('Check Bus Factor', () => {
//     const expectedBusFactor = 3;
//     expect(calculateBusFactor()).toBe(expectedBusFactor);
// });
// });

// Data Type validation test
describe('Data Type Validation', () => {
function fetchContributorData(): any {
    // Example: String data type for contributor name
    return "contributorName";
}

test('Contributor Data Type is String', () => {
    const data = fetchContributorData();
    expect(typeof data).toBe("string");
});
});

// Output data validation test
describe('Output Data Validation', () => {
function fetchOutputData(): string {
    // Placeholder for actual logic
    return "correctOutput";
}

test('Output Data is Correct', () => {
    const expectedOutput = "correctOutput";
    expect(fetchOutputData()).toBe(expectedOutput);
});
});


//test developed and regularly updated repo
const big_repo: Repository = {
    data: {
        repository: {
            diskUsage: 100000,
            mentionableUsers: {
                totalCount: 100,
                nodes: [
                    {
                        contributionsCollection: {
                            totalIssueContributions: 100,
                            totalPullRequestContributions: 100,
                            totalPullRequestReviewContributions: 100,
                            totalRepositoryContributions: 100,
                        }
                    }   
                ]
            },
            contributingGuidelines: {
                body: "This is a sample contributing guideline."
            },
            codeOfConduct: {
                body: "This is a sample code of conduct."
            },
            description: "This is a sample description.",
            hasWikiEnabled: true,
            dependencyGraphManifests: {
                edges: [
                    {
                        node: {
                            dependencies: {
                                totalCount: 100
                            },
                            dependenciesCount: 100
                        }
                    }
                ]
            },
            icount: {
                totalCount: 100
            },
            issues: {
                nodes: [
                    {
                        participants: {
                            totalCount: 50
                        },
                        closed: true,
                        updatedAt: new Date() //current date and time
                    }
                ]
            },
            createdAt: new Date(), //current date and time
            updatedAt: new Date(), //current date and time
            vulnerabilityAlerts: {
                totalCount: 1
            },
            prcount: {
                totalCount: 100
            },
            pullRequests: {
                nodes: [
                    { 
                        publishedAt: new Date(),
                    }
                ]
            },
            fcount: {
                totalCount: 3000
            },
            stargazerCount: 50,
            watchers: {
                totalCount: 50
            },
            licenseInfo: {
                name : "MIT License",
                pseudoLicense: false,
                body: "This is a sample license.",
                limitations: {
                    label: "This is a sample limitation."
                },
                implementation: "This is a sample implementation.",
                conditions: {
                    description: "This is a sample condition."
                }
            }
        },
        rateLimit: {
            cost: 2500,
            remaining: 2500,
            resetAt: new Date()
        }
    }
};
//test new repository 
const new_repo: Repository = {
    data: {
        repository: {
            diskUsage: 0,
            mentionableUsers: {
                totalCount: 0,
                nodes: [
                    {
                        contributionsCollection: {
                            totalIssueContributions: 0,
                            totalPullRequestContributions: 0,
                            totalPullRequestReviewContributions: 0,
                            totalRepositoryContributions: 0,
                        }
                    }   
                ]
            },
            contributingGuidelines: {
                body: "This is a sample contributing guideline."
            },
            codeOfConduct: {
                body: "This is a sample code of conduct."
            },
            description: "This is a sample description.",
            hasWikiEnabled: false,
            dependencyGraphManifests: {
                edges: [
                    {
                        node: {
                            dependencies: {
                                totalCount: 0
                            },
                            dependenciesCount: 0
                        }
                    }
                ]
            },
            icount: {
                totalCount: 0
            },
            issues: {
                nodes: [
                    {
                        participants: {
                            totalCount: 0
                        },
                        closed: true,
                        updatedAt: new Date() //current date and time
                    }
                ]
            },
            createdAt: new Date(), //current date and time
            updatedAt: new Date(), //current date and time
            vulnerabilityAlerts: {
                totalCount: 0
            },
            prcount: {
                totalCount: 0
            },
            pullRequests: {
                nodes: [
                    { 
                        publishedAt: new Date(),
                    }
                ]
            },
            fcount: {
                totalCount: 0
            },
            stargazerCount: 0,
            watchers: {
                totalCount: 0
            },
            licenseInfo: {
                name : "MIT License",
                pseudoLicense: false,
                body: "This is a sample license.",
                limitations: {
                    label: "This is a sample limitation."
                },
                implementation: "This is a sample implementation.",
                conditions: {
                    description: "This is a sample condition."
                }
            }
        },
        rateLimit: {
            cost: 0,
            remaining: 5000,
            resetAt: new Date()
        }
    }
};

type Repository = {
    data: {
        repository: {
            diskUsage: number;
            mentionableUsers: {
                totalCount: number;
                nodes: [
                    {
                        contributionsCollection: {
                            totalIssueContributions: number;
                            totalPullRequestContributions: number;
                            totalPullRequestReviewContributions: number;
                            totalRepositoryContributions: number;
                        }
                    }   
                ]
            }
            contributingGuidelines: {
                body: String;
            }
            codeOfConduct: {
                body: String;
            }
            description: String;
            hasWikiEnabled: boolean;
            dependencyGraphManifests: {
                edges: [
                    {
                        node: {
                            dependencies: {
                                totalCount: number;
                            }
                            dependenciesCount: number;
                        }
                    }
                ]
            }
            icount: {
                totalCount: number;
            }
            issues: {
                nodes: [
                    {
                        participants: {
                            totalCount: number;
                        }
                        closed: boolean;
                        updatedAt: Date;
                    }
                ]
            }
            createdAt: Date;
            updatedAt: Date;
            vulnerabilityAlerts: {
                totalCount: number
            }
            prcount: {
                totalCount: number;
            }
            pullRequests: {
                nodes: [
                    { 
                        publishedAt: Date,
                    }
                ]
            }
            fcount: {
                totalCount: number;
            }
            stargazerCount: number;
            watchers: {
                totalCount: number;
            }
            licenseInfo: {
                name: String;
                pseudoLicense: boolean;
                body: String;
                limitations: {
                    label: String;
                }
                implementation: String;
                conditions: {
                    description: String;
                }
            }
        }
        rateLimit: {
            cost: number;
            remaining: number;
            resetAt: Date;
        }
    };
}