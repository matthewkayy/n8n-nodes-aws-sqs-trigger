![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-nodes-aws-sqs-trigger

[n8n](https://www.n8n.io) Trigger node for consumuing queue messages from [AWS SQS](https://docs.aws.amazon.com/sqs/).

## How to install

### Community Nodes (Recommended)

For users on n8n v0.187+, your instance owner can install this node from [Community nodes](https://docs.n8n.io/integrations/community-nodes/installation/).

1. Go to **Settings > Community nodes**.
2. Select **Install a community node**.
3. Enter `@mkay/n8n-nodes-aws-sqs-trigger` in **npm Package Name**.
4. Check **"I understand the risks of installing unverified code from a public source. [More info](https://docs.n8n.io/integrations/community-nodes/risks/)"**.
5. Click **Install**.

After installing the node, you can use it like any other node. n8n displays the node in search results in the **Nodes** panel.

### Manual installation
To get started install the package in your n8n root directory:

`npm install @mkay/n8n-nodes-aws-sqs-trigger`

For Docker-based deployments, add the following line before the font installation command in your [n8n Dockerfile](https://github.com/n8n-io/n8n/blob/master/docker/images/n8n/Dockerfile):

`RUN cd /usr/local/lib/node_modules/n8n && npm install @mkay/n8n-nodes-aws-sqs-trigger`

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)
