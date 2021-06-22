import { APIGatewayProxyHandler } from 'aws-lambda';
import { v4 as uuidV4 } from 'uuid';
import { document } from '../utils/dynamoDBClient';
import dayjs from 'dayjs';

interface ITodo {
	id: String;
	user_id: String;
	title: String;
	done: Boolean;
	deadline: Date;
}

export const handle: APIGatewayProxyHandler = async (
	event,
) => {
	const { user_id } = event.pathParameters;
	const { title, deadline, id } = JSON.parse(
		event.body,
	) as ITodo;
	const deadlineDate = dayjs(deadline).format('YYYY-MM-DD');
	console.log(deadlineDate);
	await document
		.put({
			TableName: 'todos',
			Item: {
				id: id ? id : uuidV4(),
				user_id,
				title,
				done: false,
				deadline: deadlineDate,
			},
		})
		.promise();

	return {
		statusCode: 201,
		body: JSON.stringify({
			message: 'Todo task created!',
		}),
		headers: { 'Content-Type': 'application/json' },
	};
};
