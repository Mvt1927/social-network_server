import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ConfigNames } from 'src/config/interfaces/config.interface';
import { IEmailConfig } from 'src/config/interfaces/email-config.interface';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;
    emailConfig: IEmailConfig;

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.emailConfig = this.configService.get(ConfigNames.EMAIL_SERVICE);

        this.transporter = nodemailer.createTransport({
            host: this.emailConfig.host,
            port: this.emailConfig.port,
            secure: this.emailConfig.secure,
            auth: {
                user: this.emailConfig.auth.user,
                pass: this.emailConfig.auth.pass,
            },
        });
    }
    
    async sendMail(to: string, subject: string, text: string, html?: string): Promise<void> {
        const mailOptions: nodemailer.SendMailOptions = {
            from: this.emailConfig.auth.user,
            to,
            subject,
            text,
            html,
        }

        await this.transporter.sendMail(mailOptions);
    }
}
