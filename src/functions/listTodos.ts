import { APIGatewayProxyHandler } from 'aws-lambda';

import { document } from '../utils/dynamoDBClient';

export const handle: APIGatewayProxyHandler = async (
	event,
) => {
	const { user_id } = event.pathParameters;
	const response = await document
		.scan({
			TableName: 'todos',
			IndexName: 'userTodos',
			FilterExpression: 'user_id = :user_id',
			ExpressionAttributeValues: {
				':user_id': user_id,
			},
		})
		.promise();
	const userTodos = response.Items.filter(
		(todo) => todo.user_id === user_id,
	);
	if (userTodos.length > 0) {
		return {
			statusCode: 200,
			body: JSON.stringify({
				todos: userTodos,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		};
	}
	return {
		statusCode: 400,
		body: JSON.stringify({
			message: 'Invalid user!',
		}),
	};
};
