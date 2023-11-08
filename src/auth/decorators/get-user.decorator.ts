import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";


export const getUser = createParamDecorator(
    (data, ctx: ExecutionContext) => {
        console.log(data);

        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        if (!user) {
            throw new InternalServerErrorException('User not found (request)');
        }
        if (!data) {
            return user;
        }
        return user?.email

    }
)