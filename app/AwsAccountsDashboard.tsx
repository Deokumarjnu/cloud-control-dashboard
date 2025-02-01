"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface AwsAccount {
  accountId: string;
  name: string;
}

interface EC2Instance {
  InstanceId: string;
  InstanceType: string;
  State: { Name: string };
  Tags?: Array<{ Key: string; Value: string }>;
}

const AwsAccountsDashboard: React.FC = () => {
  const [accounts, setAccounts] = useState<AwsAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [instances, setInstances] = useState<EC2Instance[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      const response = await axios.get('/accounts');
      setAccounts(response.data);
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      const fetchInstances = async () => {
        const response = await axios.get(`/accounts/${selectedAccount}/instances`);
        setInstances(response.data);
      };
      fetchInstances();
    }
  }, [selectedAccount]);

  return (
    <div className="dashboard">
      <div className="accounts-list">
        <h2>AWS Accounts</h2>
        {accounts.map(account => (
          <div 
            key={account.accountId}
            className={`account-card ${selectedAccount === account.accountId ? 'selected' : ''}`}
            onClick={() => setSelectedAccount(account.accountId)}
          >
            <h3>{account.name}</h3>
            <p>{account.accountId}</p>
          </div>
        ))}
      </div>

      <div className="instances-panel">
        <h2>EC2 Instances {selectedAccount && `(Account: ${selectedAccount})`}</h2>
        <div className="instance-grid">
          {instances.map(instance => (
            <div key={instance.InstanceId} className="instance-card">
              <div className="instance-header">
                <h4>{instance.Tags?.find(t => t.Key === 'Name')?.Value || 'Unnamed'}</h4>
                <span className={`status ${instance.State.Name.toLowerCase()}`}>
                  {instance.State.Name}
                </span>
              </div>
              <p>Instance ID: {instance.InstanceId}</p>
              <p>Type: {instance.InstanceType}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AwsAccountsDashboard;