package passwordConvertor;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.Arrays;
import java.util.List;

public class Encryption {
    public static void main(String[] args) {
        try {
            String msg = "Hello World" ;
            String publicKey = "age1lnue4knu3r02hcc6pynp42cg469u85f3jyfcfy0z93js96rgascs0mgww5" ;
            ProcessBuilder pb = new ProcessBuilder("age", "-r", publicKey, "-o", "me.txt.age");
            String command = String.format("echo \"%s\" | age -a -r \"%s\"",msg,publicKey) ;
            pb = new ProcessBuilder("bash","-c",command);
            String privateKey = "AGE-SECRET-KEY-1H0PG5KAX5WMYQDQXJPNH02GXRLJMGUPPUQSX6T7TJSULUX4P6D0Q0Q24ZN" ;
            Process process = pb.start();

//            try ( BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(process.getOutputStream())) ){
//                writer.write(msg);
//                writer.flush();
//            }

            BufferedReader br = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder sb = new StringBuilder();
            String line ;
//            while ( (line = br.readLine()) != null ) {
////                System.out.println(line);
//                sb.append(line).append("\n");
//            }
//            String encrptedMsg = sb.toString() ;
//            System.out.println(encrptedMsg);
//
//            int exitCode = process.waitFor();
//
//
//            command = String.format("echo \"%s\" | age -d -i <(echo \"%s\")",encrptedMsg,privateKey) ;
//            pb = new ProcessBuilder("bash","-c",command);
//            process = pb.start();
//            br = new BufferedReader(new InputStreamReader(process.getInputStream()));
//            sb = new StringBuilder();
//            while ( (line = br.readLine()) != null ) {
//                sb.append(line+"\n");
//            }
//            System.out.println(sb);
//
//            exitCode = process.waitFor();

            command = "echo \"hello\" | age --passphrase" ;
            List<String> encryptCommand = Arrays.asList(
                    "sh", "-c", command
            );
            pb = new ProcessBuilder(encryptCommand);
//            pb.environment().put("AGE_PASSPHRASE","siva");
            process = pb.start();

//            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()));
//            bw.write("world\n");
//            bw.flush();
//            bw.write("world\n");
//            bw.flush();
//            bw.close();

            br = new BufferedReader(new InputStreamReader(process.getInputStream()));
            sb = new StringBuilder();
            while ( (line = br.readLine()) != null ) {
                sb.append(line).append("\n");
            }
            BufferedReader err = new BufferedReader(new InputStreamReader(process.getErrorStream())); // error output
            while ((line = err.readLine()) != null) {
                System.err.println("ERROR: " + line);
            }

            System.out.println(sb);

//
//            if ( exitCode == 0 ) {
//                System.out.println("File encrypted successfully!");
//            }
//            else {
//                System.out.println("Encryption failed. Exit code: " + exitCode);
//                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
//                    while ((line = reader.readLine()) != null) {
//                        System.err.println(line);
//                    }
//                }
//            }

//            pb = new ProcessBuilder("age" , "-d" , "-i" , "-" , "me.txt.age");
//            process = pb.start();
//            try ( BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(process.getOutputStream())) ) {
//                writer.write(privateKey);
//                writer.flush();
//            }
//            StringBuilder sb = new StringBuilder();
//            try ( BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream())) ) {
//                String line;
//                while ( (line = reader.readLine()) != null) {
//                    sb.append(line);
//                    System.out.println(line);
//                }
//            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
//        ProcessBuilder pb = new ProcessBuilder("bash","-c","age-keygen");
//        try {
//            Process process = pb.start();
//            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
//            String line = null ;
//            int i = 0 ;
//            while ( (line = reader.readLine()) != null ) {
//                if ( i == 2 ) {
//                    System.out.println(line);
//                }
//                if ( i == 1 ) {
//                    System.out.println(line.substring("# public key: ".length()).trim());
//                }
//                i++;
//            }
//        }
//        catch(Exception e) {
//            System.out.println(e.getMessage());
//            e.printStackTrace();
//        }
    }
}
