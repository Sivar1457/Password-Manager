package passwordConvertor;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;

public class Encryption {
    public static void main(String[] args) {
        try {
            ProcessBuilder pb = new ProcessBuilder("age", "-r", "age1lnue4knu3r02hcc6pynp42cg469u85f3jyfcfy0z93js96rgascs0mgww5", "-o", "me.txt.age", "me.txt");
            Process process = pb.start();
            int exitCode = process.waitFor();

            if ( exitCode == 0 ) {
                System.out.println("File encrypted successfully!");
            }
            else {
                System.out.println("Encryption failed. Exit code: " + exitCode);
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        System.err.println(line);
                    }
                }
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
}
