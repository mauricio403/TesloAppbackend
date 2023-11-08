import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const RawHeaders = createParamDecorator(
    (data, ctx: ExecutionContext) => {
        const resp = ctx.switchToHttp().getRequest();
        const headers = resp.rawHeaders;
        return headers
    }
)